package database.entity;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonManagedReference;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Entity implementation class for Entity: Item
 *
 */
@NamedQueries({
@NamedQuery(name = "Item.findById", query = "Select o from Item o where o.id = :id"),
@NamedQuery(name = "Item.deleteById", query = "delete  from Item o where o.id = :id")

})

@Entity
@XmlRootElement
public class Item implements Serializable {

	   
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String name;
	private String description;
	private double price;
	
//	@OneToMany(mappedBy="item",cascade=CascadeType.ALL,fetch=FetchType.EAGER)
//	@JsonManagedReference("item_ordersitems")
//	@OnDelete(action = OnDeleteAction.CASCADE)
//	private Set<Orders_Items> orderItems ;

	@OneToMany(mappedBy="item",cascade=CascadeType.ALL,fetch=FetchType.EAGER)
	@JsonManagedReference("item_ordersitems")
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JsonIgnore
	private Set<Orders_Items> orderItems ;

	@ManyToOne
	@JoinColumn(name="menu_id")
	@JsonBackReference("item_menu")
	private Menu menu;
	
	
	
	
	private static final long serialVersionUID = 1L;

	public Item() {
		super();
	}   
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}   
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}   
	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}   
	public double getPrice() {
		return this.price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
	
	public Menu getMenu() {
		return menu;
	}
	public void setMenu(Menu menu) {
		this.menu = menu;
	}
	
	@Override
	public String toString() {
		return "Item [id=" + id + ", name=" + name + "]";
	}
	public Set<Orders_Items> getOrderItems() {
		return orderItems;
	}
	public void setOrderItems(Set<Orders_Items> orderItems) {
		this.orderItems = orderItems;
	}
	
}
