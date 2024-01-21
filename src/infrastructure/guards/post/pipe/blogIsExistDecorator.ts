import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { BlogsQueryRepository } from '../../../../api/blogs/blogs.queryReposity';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsBlogExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {
    }
   async validate(blogId: any, args: ValidationArguments) {

        const blog = await this.blogsQueryRepository.findRawBlogById(blogId)
    //    console.log(blog)
       return !!blog;
    }
}

export function IsBlogExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsBlogExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBlogExistConstraint,
        });
    };
}