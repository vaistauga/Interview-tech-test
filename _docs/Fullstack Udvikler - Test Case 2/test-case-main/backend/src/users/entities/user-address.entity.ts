import { Embeddable, Property } from "@mikro-orm/core";
import { ApiProperty } from "@nestjs/swagger";

@Embeddable()
export class UserAddress {
  @Property()
  @ApiProperty()
  city?: string | null = null;

  @Property()
  @ApiProperty()
  zip?: string | null = null;
}