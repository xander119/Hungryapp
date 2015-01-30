package database.entity;

import database.entity.Item;
import database.entity.Orders;

import java.io.Serializable;
import java.lang.Integer;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Orders_Items
 *
 */
@Entity
@IdClass(Orders_ItemsPK.class)
public class Orders_Items implements Serializable {

	
	@Id
	private Orders order;
	@Id
	private Item item;   
	
	private static final long serialVersionUID = 1L;

	public Orders_Items() {
		super();
	}   
	public Orders getOrder() {
		return this.order;
	}

	public void setOrder(Orders order) {
		this.order = order;
	}   
	public Item getItem() {
		return this.item;
	}

	public void setItem(Item item) {
		this.item = item;
	}   
	
   
}
