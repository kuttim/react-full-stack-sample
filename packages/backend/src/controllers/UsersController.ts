import { RequestHandler } from "express";
import * as httpStatusCodes from "http-status-codes";
import { UserDto } from "../models/dtos/UserDto";
import { UserEntity } from "../models/entities/UserEntity";
import { createLogger } from "../utils/LoggerUtil";
import { Omit } from "../utils/TypeScriptUtils";

// Small helper type to embed id parameters into custom types.
type WithId = {
    id: number;
};

const log = createLogger("api:controllers:users");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET /
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getAllUsers: RequestHandler = async (_, result) => {
    // Log some debug information.
    log(`GET /users`);
    // Fetch all UserEntities from the database.
    const userEntities = await UserEntity.find();
    // Send an OK with all UserEntities converted to UserDtos.
    result.status(httpStatusCodes.OK).json(userEntities.map(UserDto.fromEntity));
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GET /:id
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type GetUserByIdRequestParams = WithId;

export const getUserById: RequestHandler = async (request, result) => {
    // The parameters are typed as any by default. Manually typecast them to enable TypeScript support.
    const requestParams = request.params as GetUserByIdRequestParams;
    // Log some debug information.
    log(`GET /users/:id (id = ${requestParams.id})`);
    // Query the database for a UserEntity where the id is equal to the provided id via the parameters.
    // More details on Entity.find: https://typeorm.io/#/find-options
    const userEntity = await UserEntity.findOne({ where: { id: requestParams.id } });

    // Check whether we have any result.
    if (userEntity !== undefined) {
        // Send an OK with the UserEntity converted to a UserDto.
        result.status(httpStatusCodes.OK).json(new UserDto(userEntity));
        // Alternatively:
        //  result.status(httpStatusCodes.OK).json(UserDto.fromEntity(userEntity));
    } else {
        // BEWARE: status(...) would NOT send the result, but sendStatus does!
        // If you use status without sending anything, then the request would time out without a response!
        result.sendStatus(httpStatusCodes.NOT_FOUND);
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// POST /
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Omit the id key from the UserDto since we don't expect and don't want the client to send an actual id for this
// operation. To omit more than one field use the following syntax: Omit<T, "foo" | "bar" | "baz">.
type CreateUserRequestBody = Omit<UserDto, "id">;

export const createUser: RequestHandler = async (request, result) => {
    // Log some debug information.
    log(`POST /users`);
    // The request body is typed as any by default. Manually typecast it to enable TypeScript support.
    const requestBody = request.body as CreateUserRequestBody;
    // Attempt to parse the request body (which "should" look like a UserDto) as a UserEntity and add some server-side
    // data such as a password to it. Usually you'd validate the request body before attempting to create a new entity
    // just to be sure. This includes the validation of data in general as well the removal of unrequested data such as
    // a custom id that can be injected unintentionally as well! You might want to look into some more sophisticated
    // middleware such as express-validation for this once you're more experienced.
    const userEntity = UserEntity.create({ ...requestBody, password: "super-secret" });

    try {
        // Attempt to save the new UserEntity to the database, since the object was still not written into the database.
        // Keep in mind that TypeORMs save method will attempt to create the database entry if it does not exist yet;
        // otherwise it will update an existing entry. Try to handle both cases separately using POST and PUT verbs.
        await UserEntity.save(userEntity);

        // This will send a CREATED result to the client and include further information in the header. In our case it
        // will be the location field that can be used by the client to retrieve the newly created UserEntity from the
        // database. Notice how TypeORM will automaticcaly assign the correct id to the newly created UserEntity.
        result.location(`/users/${userEntity.id}`).sendStatus(httpStatusCodes.CREATED);
    } catch (error) {
        // Some error happened while attempting to save the UserEntity. This can be a failed UNIQUE constraint for
        // example or some other unexpected error that should be handled appropriately.
        result.sendStatus(httpStatusCodes.CONFLICT);
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE /:id
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type DeleteUserByIdRequestParams = WithId;

export const deleteUserById: RequestHandler = async (request, result) => {
    // The parameters are typed as any by default. Manually typecast them to enable TypeScript support.
    // This time with some fancy destructuring!
    const { id } = request.params as DeleteUserByIdRequestParams;
    // Log some debug information.
    log(`DELETE /users/:id (id = ${id})`);
    // Notice how we do not write { id: id } in the where clause? If your variable happens to have the very same name
    // as a variable in an object you assign to, you can just omit it once.
    const userEntity = await UserEntity.findOne({ where: { id } });

    // Check whether we have any result.
    if (userEntity !== undefined) {
        // Delete the UserEntity by its id - other criterias to check for before deleting are possible as well.
        await UserEntity.delete({ id });
        // Only send an OK without an actual response body.
        result.sendStatus(httpStatusCodes.OK);
    } else {
        // Send a NOT FOUND to indicate the wrong id in the request parameters.
        result.sendStatus(httpStatusCodes.NOT_FOUND);
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PUT /:id
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type UpdateUserByIdRequestParams = WithId;
type UpdateUserByIdRequestBody = UserDto;

export const updateUserById: RequestHandler = async (request, result) => {
    // The parameters are typed as any by default. Manually typecast them to enable TypeScript support.
    const { id } = request.params as UpdateUserByIdRequestParams;
    // Log some debug information.
    log(`PUT /users/:id (id = ${id})`);
    // The request body is typed as any by default. Manually typecast it to enable TypeScript support.
    const requestBody = request.body as UpdateUserByIdRequestBody;
    // Query the database for a UserEntity where the id is equal to the provided id via the parameters.
    const userEntity = await UserEntity.findOne({ where: { id } });

    // Check whether we have any result.
    if (userEntity !== undefined) {
        // Check that the id in the request body is the same as the id of the UserEntity we just fetched from the
        // database. This can make sure we're not accidentally allowing someone to tamper with the data.
        if (userEntity.id !== requestBody.id) {
            // Send a CONFLICT to indicate a mismatch of the actual ids.
            result.sendStatus(httpStatusCodes.CONFLICT);
        } else {
            // Use this helper method to take the UserEntity from the database and merge everything from the request
            // body into it. Once again, notice we're not doing any validation at all. Accepting data and attempting to
            // coerce it into a UserEntity can cause undefined behaviour! Therefore the spreading of the content of
            // requestBody is rather risky and it'd be much safer to manually define all properties to update. However
            // we're lazy and the spread notation is super slick.
            UserEntity.merge(userEntity, { ...requestBody, password: "updated-password" });
            // Save the entity to the database.
            await UserEntity.save(userEntity);
            // Just send an OK.
            result.sendStatus(httpStatusCodes.OK);
        }
    } else {
        // Send a NOT FOUND to indicate the wrong id in the request parameters.
        result.sendStatus(httpStatusCodes.NOT_FOUND);
    }
};
