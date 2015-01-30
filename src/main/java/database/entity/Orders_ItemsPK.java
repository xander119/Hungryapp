package database.entity;

import java.io.Serializable;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

public class Orders_ItemsPK implements Serializable {
	
	private static final long serialVersionUID = 1L;
	@ManyToOne
	@JoinColumn(name="order",referencedColumnName="id")
	private Orders order;
	@ManyToOne
	@JoinColumn(name="item",referencedColumnName="id")
	private Item item;   
}
