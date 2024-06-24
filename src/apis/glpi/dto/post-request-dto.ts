import {ApiProperty} from '@nestjs/swagger';

/**region [ Global ] */
/**
 * @param {string} name
 */
export class IRequestUsernameDto {
    @ApiProperty()
    name: string
}

/**
 * @param {number} id
 */
export class IRequestTicketIdDto {
    @ApiProperty()
    id: number
}

// endregion

/**region [ Ticket list ] */
/**
 * @param {number} id
 * @param {number} type
 * @param {string} name
 * @param {string} category
 * @param {string} date_creation
 * @param {string} time_to_solve
 */
export class IUserTicketsResponse {
    @ApiProperty()
    id: number

    @ApiProperty()
    type: number

    @ApiProperty()
    name: string

    @ApiProperty()
    category: string

    @ApiProperty({example: '2024-01-01T00:00:00.000Z'})
    date_creation: string

    @ApiProperty({example: '2024-01-01T00:00:00.000Z'})
    time_to_solve: string
}


/**
 * @param {number} ticket_id
 * @param {string} name
 * @param {number} type
 */
export class ITicketsMembersResponse {
    @ApiProperty()
    ticket_id: number

    @ApiProperty()
    id: number

    @ApiProperty()
    name: string

    @ApiProperty()
    memberType: 1 | 2         // 1 - user, 2 - group

    @ApiProperty()
    accessoryType: 1 | 2 | 3  // 1 - applicants, 2 - specialists, 3 - watchers
}

// endregion

//ToDo CHECK & CHANGE
/**region [ Ticket info ] */
/**
 * @param {number} id
 * @param {string} name
 * @param {number} status
 * @param {number} type
 * @param {string} completename
 * @param {string} date_creation
 * @param {string} time_to_resolve
 * @param {string} solvedate
 * @param {string} closedate
 * @param {string} content
 */
export class IGetTicketInfoResponse {
    @ApiProperty()
    id: number

    @ApiProperty()
    name: string

    @ApiProperty()
    status: number

    @ApiProperty()
    type: number

    @ApiProperty()
    completename: string

    @ApiProperty()
    date_creation: string

    @ApiProperty()
    time_to_resolve: string

    @ApiProperty()
    solvedate: string

    @ApiProperty()
    closedate: string

    @ApiProperty()
    content: string
}

/**
 * @param {number} id
 * @param {string} name
 * @param {number} type
 * @param {number} itemType
 */
export class IGetTicketUsersResponse {
    @ApiProperty()
    id: number

    @ApiProperty()
    name: string

    @ApiProperty()
    type: number

    @ApiProperty()
    itemType: number
}

/**
 * @param {}
 */
export class IGetTicketFollowupsResponse {
    @ApiProperty()
    id: number

    @ApiProperty()
    item_id: number

    @ApiProperty()
    name: string

    @ApiProperty()
    content: string

    @ApiProperty()
    date_creation: string
}

// endregion