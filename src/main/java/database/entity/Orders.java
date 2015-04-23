package database.entity;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonManagedReference;


/**
 * Entity implementation class for Entity: Orders
 *
 */
@NamedQuery(name="Orders.getAllOrders",query="select o from Orders o")

@Entity
@XmlRootElement
public class Orders implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String orderedDate;
	private double totalPrice;
	@Convert(converter=BooleanToYNStringConverter.class)
	@Column(nullable=false)
	private boolean isComplete;
	private String completeTime;
	@ManyToOne
	@JoinColumn(name="restaurant_id")
	@JsonBackReference("orders")
	private Restaurant restaurant;
	@ManyToOne
	@JoinColumn(name="customer_userid")
	@JsonBackReference("customer")
	private Customer customer;
	
	@OneToMany(mappedBy = "order",cascade=CascadeType.ALL,fetch=FetchType.EAGER)
	@JsonManagedReference("order_ordersitems")
	private List<Orders_Items> orderItems ;

	private static final long serialVersionUID = 1L;

	public Orders() {
		super();
	}   
	 
	public int getId() {
		return this.id;
	}

	public void setId(int orderId) {
		this.id = orderId;
	}   
	public String getOrderedDate() {
		return this.orderedDate;
	}

	public void setOrderedDate(String orderedDate) {
		this.orderedDate = orderedDate;
	}   
	public double getTotalPrice() {
		return this.totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}   
	  
	 
	public Customer getCustomerId() {
		return this.customer;
	}

	public void setCustomerId(Customer customerId) {
		this.customer = customerId;
	}   
	
	public String getCompleteTime() {
		return this.completeTime;
	}

	public void setCompleteTime(String completeTime) {
		this.completeTime = completeTime;
	}

	

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public boolean isComplete() {
		return isComplete;
	}

	public void setComplete(boolean isComplete) {
		this.isComplete = isComplete;
	}

//	public List<Item> getItems() {
//		return items;
//	}
//
//	public void setItems(List<Item> items) {
//		this.items = items;
//	}

	

	public List<Orders_Items> getOrderItems() {
		return orderItems;
	}

	public void setOrderItems(List<Orders_Items> orderItems) {
		this.orderItems = orderItems;
	}

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}

	
	
}
