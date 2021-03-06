
package database.entity;

import database.entity.Item;
import database.entity.Orders;

import java.io.Serializable;
import java.lang.Integer;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Entity implementation class for Entity: Orders_Items
 *
 */
@Entity 
@XmlRootElement
public class Orders_Items implements Serializable {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer id;
	@ManyToOne
	@JoinColumn(name="order_id",referencedColumnName="id")
	@JsonBackReference("order_ordersitems")
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Orders order;
	
	@ManyToOne
	@JoinColumn(name="item_id",referencedColumnName="id")
	@JsonBackReference("item_ordersitems")
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Item item;
	
	private int quantity;
	
	private static final long serialVersionUID = 1L;

	public Orders_Items() {
		super();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Orders getOrder() {
		return order;
	}

	public void setOrder(Orders order) {
		this.order = order;
	}

	public Item getItem() {
		return item;
	}

	public void setItem(Item item) {
		this.item = item;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	@Override
	public String toString() {
		return "Orders_Items [id=" + id + ", order=" + order + ", item=" + item
				+ ", quantity=" + quantity + "]";
	}   
	
	
	
	
   
}
