import { UserEntity } from "../entities/UserEntity";

// This Dto class is used to omit certain data from the actual UserEntity class, in our case the password field. When
// we send any user as a result to a client we'd like to keep some data only on the server and hidden. Hence we use the
// entities on the server while using Dtos when interacting with clients.
export class UserDto {
    public id: number;
    public name: string;
    public username: string;
    public email: string;

    // This constructs a UserDto from a given UserEntity via new UserDto(userEntity).
    public constructor({id, name, username, email}: UserEntity) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
    }

    // This is mostly used in combination with Array.map, since you cannot map a constructor.
    public static fromEntity(userEntity: UserEntity) {
        return new UserDto(userEntity);
    }
}
