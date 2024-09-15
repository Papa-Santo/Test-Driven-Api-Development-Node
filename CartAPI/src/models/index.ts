import {
  DataTypes,
  Model,
  CreationOptional,
  NonAttribute,
} from "@sequelize/core";
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  HasMany,
  Default,
  BelongsTo,
} from "@sequelize/core/decorators-legacy";

export interface I_Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export class product extends Model<I_Product> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare description: string;

  @Attribute(DataTypes.DECIMAL)
  @NotNull
  declare price: number;
}

export interface I_OrderItem {
  id?: number;
  quantity: number;
  price: number;
  productid: number;
  product?: I_Product;
  orderheaderid: number;
  orderheader?: string;
}

export class lineitem extends Model<I_OrderItem> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare quantity: number;

  @Attribute(DataTypes.DECIMAL)
  declare price: number;

  @BelongsTo(() => product, /* foreign key */ "productid")
  declare product?: NonAttribute<product>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare productid: number;

  @BelongsTo(
    () => orderheader,
    /* foreign key */ {
      foreignKey: {
        name: "orderheaderid",
        onDelete: "CASCADE",
      },
    }
  )
  declare orderheader?: NonAttribute<orderheader>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare orderheaderid: number;
}

export interface I_Order {
  id?: number;
  status?: number;
  customer: number;
  total: number;
  lineitems?: I_OrderItem[];
}

export class orderheader extends Model<I_Order> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @Default(0)
  declare status: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  declare customer: number;

  @Attribute(DataTypes.DECIMAL)
  declare total: number;

  @HasMany(() => lineitem, {
    foreignKey: {
      name: "orderheaderid",
      onDelete: "CASCADE",
    },
    inverse: {
      as: "orderheader",
    },
  })
  declare lineitems?: NonAttribute<lineitem[]>;
}
