import {AxiosResponse} from "axios";
import {InjectDataSource} from "@nestjs/typeorm";
import {GLPI_DB_CONNECTION} from "~root/src/constants";
import {DataSource} from "typeorm";
import {IGlpiUserToken} from "~root/src/connectors/glpi/types";
import {HttpStatus} from "@nestjs/common";
import {PayloadType} from "~form/types";

// ToDo почистить, добавить типы
export class GLPI {
    private session = require('axios')

    private readonly _baseUrl = process.env.GLPI_API_URL || 'https://sd.paritet.su/apirest.php/'
    private readonly _appToken = process.env.GLPI_API_TOKEN || ''
    private _username: string
    private _userToken: string
    userId: number
    userFIO: string
    sessionToken: string
    authorized: boolean

    constructor(username: string, @InjectDataSource(GLPI_DB_CONNECTION) private readonly glpi: DataSource) {
        return (async (): Promise<GLPI> => {
            this._username = username

            this.session.defaults.validateStatus = (status: number) => status >= 200 && status < 500
            this.session.defaults.baseURL = this._baseUrl
            this.session.defaults.headers.common = {
                'Content-Type': 'application/json',
                'App-Token': this._appToken,
            }

            this._userToken = await this._get_user_token()

            const res: AxiosResponse = await this._initSession()

            if (res.status === HttpStatus.OK) {
                this.authorized = true
                this.userId = res.data.session.glpiID
                this.userFIO = res.data.session.glpifriendlyname
                this.sessionToken = res.data.session_token
                this.session.defaults.headers.common['Session-Token'] = this.sessionToken
            } else {
                this.authorized = false
            }

            return this
        })() as unknown as GLPI
    }

    private async _get_user_token() {
        const ret: IGlpiUserToken[] = await this.glpi.query('' +
            'SELECT api_token               ' +
            'FROM glpi_users                ' +
            `WHERE name = '${this._username}' `
        )
        return ret && ret.length > 0 && ret[0].api_token !== null ? ret[0].api_token : await this._setUserToken()
    }

    private async _generateUserToken() {
        const length = 40
        const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        let token = ''

        for (let i = 0; i < length; i++) {
            token += charset[Math.floor(Math.random() * charset.length)]
        }

        return token
    }

    private async _setUserToken() {
        const token = await this._generateUserToken()

        await this.glpi.query('' +
            'update glpi_users                  ' +
            `set api_token = '${token}'       ` +
            `where name = '${this._username}' `
        )

        return token
    }

    private async _initSession() {
        const auth_header = {
            'Authorization': 'user_token ' + this._userToken
        }
        return this.session.get('initSession', {headers: auth_header, params: {get_full_session: true}})
            .then((response: AxiosResponse) => {
                return response
            })
    }

    async kill_session() {
        return this.session.get('killSession')
    }

    async get_item(itemType: string, itemId: number) {
        const {status, data} = await this.session.get(`${itemType}/${itemId}`)
        return {status, data}
    }

    async get_all_items(itemType: string) {
        const {status, data} = await this.session.get(itemType)
        return {status, data}
    }

    async add_items(itemType: string, payload: PayloadType[]) {
        const _payload = {
            input: payload
        }
        return this.session.post(itemType, _payload)
    }

    async create_followup(ticket_id: number, text: string) {
        const payload = {
            input: {
                itemtype: 'Ticket',
                items_id: ticket_id,
                users_id: this.userId,
                content: text,
            }
        }
        return this.session.post('ITILFollowup', payload)
    }

    async upload_document(files: Express.Multer.File[]) {
        const FormData = require('form-data')
        const form = new FormData()

        form.append('uploadManifest', JSON.stringify({
            input: files.map(file => {
                return {
                    name: decodeURIComponent(file.originalname),
                    _filename: [decodeURIComponent(file.originalname)]
                }
            })
        }))

        files.forEach((file, index) => {
            form.append(decodeURIComponent(file.originalname), file.buffer, decodeURIComponent(file.originalname))
        })

        return await this.session.post('Document', form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...form.getHeaders()
            }
        })
    }

    async upload_ticket_document(files: Express.Multer.File[], ticketId: number) {
        const createdFiles = await this.upload_document(files)

        console.log(``)

        await this.glpi.query(`
            insert into glpi_documents_items
            (documents_id, items_id, itemtype, date_mod, users_id, date_creation, date)
            values ${createdFiles.data.map((file, index) => {
            return `(
                    ${file.id},
                    ${ticketId},
                    'Ticket',
                    NOW(),
                    (select id from glpi_users where name = '${this._username}'),
                    NOW(),
                    NOW()
                )` + (index + 1 < createdFiles.data.length ? '' : ';')
        })}`)

        return {
            status: createdFiles.status,
            ticket_id: ticketId,
            data: createdFiles.data
        }
    }

    async download_document(docId: number) {
        const headers = {
            'Accept': 'application/octet-stream',
        }
        return await this.session.get(`Document/${docId}`, {
            headers: headers,
            responseType: 'arraybuffer'
        }).then((response: AxiosResponse) => {
            const mime = response.headers['content-type']
            const {data, status} = response
            return {status: status, data: data, mime: mime}
        })
    }
}