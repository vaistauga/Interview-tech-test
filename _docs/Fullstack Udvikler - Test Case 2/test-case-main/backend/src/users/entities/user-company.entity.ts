import { Embeddable, Property } from "@mikro-orm/core";
import { ApiProperty } from "@nestjs/swagger";

@Embeddable()
export class UserCompany {
  @Property()
  @ApiProperty()
  name?: string | null = null;
}