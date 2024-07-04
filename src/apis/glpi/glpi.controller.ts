import {Body, Controller, Get, Header, Post, Res, UploadedFile, UseInterceptors} from "@nestjs/common";
import {ApiTags, ApiBody, ApiResponse} from '@nestjs/swagger';
import {Roles} from '~guards/roles-auth.decorator';
import {GlobalRoles} from '~roles/All-roles';
import {GLPI_Roles} from '~roles/glpi.roles';
import {GLPI_Service} from '~glpi/glpi.service';
import {
    GetTicketInfoResponse,
    GetTicketUsersResponse,
    GetTicketFollowupsResponse,
    RequestUsernameDto,
    RequestTicketIdDto,
    UserTicketsResponse,
    TicketsMembersResponse,
    RequestTicketIdAndUsernameDto,
    SetTicketFollowupsDto,
    SetTicketFollowupsResponse,
    RequestUserAccessOnTicket,
    RequestDownloadDocumentDto,
    RequestFileUploadDto, CreateTicketFollowupDto,
} from '~glpi/dto/post-request-dto';
import {Response, Express} from "express";

import {GLPI_DB_CONNECTION} from '~root/src/constants';
import {GetGlpiUsersInGroupsResponse} from "~glpi/dto/get-request-dto";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags(GLPI_DB_CONNECTION)
@Controller("glpi")
export class GLPI_Controller {
    constructor(private glpiService: GLPI_Service) {
    }

    /**region [ Ticket list ] */
    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Post("/GetUserTickets")
    @Header("content-type", "application/json")
    @ApiBody({required: false, type: RequestUsernameDto})
    @ApiResponse({type: [UserTicketsResponse]})
    gut(@Body() dto: RequestUsernameDto, @Res() res: Response) {
        return this.glpiService.GetUserTickets(dto, res);
    }

    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Post("/GetTicketsMembers")
    @Header("content-type", "application/json")
    @ApiBody({required: true, type: RequestUsernameDto})
    @ApiResponse({type: [TicketsMembersResponse]})
    gtm(@Body() dto: RequestUsernameDto, @Res() res: Response) {
        return this.glpiService.GetTicketsMembers(dto, res);
    }

    // endregion

    /**region [ Ticket info ] */
    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Post("/GetUserAccessOnTicket")
    @Header("content-type", "application/json")
    @ApiBody({required: true, type: RequestTicketIdAndUsernameDto})
    @ApiResponse({type: [RequestUserAccessOnTicket]})
    guaot(@Body() dto: RequestTicketIdAndUsernameDto, @Res() res: Response) {
        return this.glpiService.GetUserAccessOnTicket(dto, res);
    }

    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Post("/GetTicketInfo")
    @Header("content-type", "application/json")
    @ApiBody({required: true, type: RequestTicketIdAndUsernameDto})
    @ApiResponse({type: [GetTicketInfoResponse]})
    gtibi(@Body() dto: RequestTicketIdAndUsernameDto, @Res() res: Response) {
        return this.glpiService.GetTicketInfo(dto, res);
    }

    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Post("/GetTicketMembers")
    @Header("content-type", "application/json")
    @ApiBody({required: true, type: RequestTicketIdDto})
    @ApiResponse({type: [GetTicketUsersResponse]})
    gtubti(@Body() dto: RequestTicketIdDto, @Res() res: Response) {
        return this.glpiService.GetTicketMembers(dto, res);
    }

    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Post("/GetTicketChat")
    @Header("content-type", "application/json")
    @ApiBody({required: true, type: RequestTicketIdAndUsernameDto})
    @ApiResponse({type: [GetTicketFollowupsResponse]})
    gtfbti(@Body() dto: RequestTicketIdAndUsernameDto, @Res() res: Response) {
        return this.glpiService.GetTicketChat(dto, res);
    }

    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Post("/SetTicketFollowup")
    @Header("content-type", "application/json")
    @ApiBody({required: true, type: SetTicketFollowupsDto})
    @ApiResponse({type: [SetTicketFollowupsResponse]})
    stf(@Body() dto: SetTicketFollowupsDto, @Res() res: Response) {
        return this.glpiService.SetTicketFollowup(dto, res);
    }

    // endregion

    /**region [ Phonebook ] */
    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Get("/GetGlpiUsersInGroups")
    @Header("content-type", "application/json")
    @ApiResponse({type: [GetGlpiUsersInGroupsResponse]})
    gguig(@Res() res: Response) {
        return this.glpiService.GetGlpiUsersInGroups(res);
    }

    // endregion

    /**region [Test] */
    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Get("/CreateTicketFollowup")
    @Header("content-type", "application/json")
    @ApiBody({required: true, type: CreateTicketFollowupDto})
    // @ApiResponse({type: [CreateTicketFollowupDto]})
    ctf(@Body() dto: CreateTicketFollowupDto, @Res() res: Response) {
        return this.glpiService.CreateTicketFollowup(dto, res);
    }

    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Post("/UploadTicketDocument")
    @UseInterceptors(FileInterceptor('file'))
    ud(@UploadedFile() file: Express.Multer.File, @Body() dto: RequestFileUploadDto, @Res() res: Response) {
        return this.glpiService.UploadTicketDocument(file, dto, res);
    }

    @Roles(GLPI_Roles.GLPI_DATA, ...Object.values(GlobalRoles))
    @Post("/DownloadDocument")
    @Header("content-type", "application/octet-stream")
    @ApiBody({required: true, type: RequestDownloadDocumentDto})
    dd(@Body() dto: RequestDownloadDocumentDto, @Res() res: Response) {
        return this.glpiService.DownloadDocument(dto, res);
    }

    // endregion
}
