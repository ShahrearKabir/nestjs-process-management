import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Process } from "../schemas/process.schema";

export class CreateProcessDto extends Process {}
