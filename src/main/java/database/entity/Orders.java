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
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonManagedReference;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;


/**
 * Entity implementation class for Entity: Orders
 *
 */
@NamedQueries({
@NamedQuery(name="Orders.getAllOrders",query="select o from Orders o"),
@NamedQuery(name="Orders.findById",query="select o from Orders o where o.id = :id"),
@NamedQuery(name="Orders.getPendingOrders",query="select o from Orders o where o.isAccpected = 'pending' and o.customer.userid = :id")

})

@Entity
@XmlRootElement
public class Orders implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String orderedDate;
	private double totalPrice;
	private String isComplete;
	private String completeTime;
	private String isAccpected;
	private String paymentType;
	@ManyToOne
	@JoinColumn(name="restaurantLocation_id")
	@JsonBackReference("restaurantLocation_orders")
	private RestaurantLocation restaurantLocation;
	@ManyToOne
	@JoinColumn(name="customer_userid")
	@JsonBackReference("customer_orders")
	private Customer customer;
	@ManyToOne
	@JoinColumn(name="address_id")
	@JsonBackReference("order_address")
	private Address address ;
	
//	@OneToMany(mappedBy = "orders",cascade=CascadeType.ALL,fetch=FetchType.EAGER)
//	@JsonManagedReference("order_ordersitems")
//	@OnDelete(action = OnDeleteAction.CASCADE)
//	private Set<Orders_Items> orderItems ;
	
	@ManyToMany
	 @JoinTable(name="orders_items",joinColumns=@JoinColumn(name = "orders_fk"),
	 inverseJoinColumns=@JoinColumn(name = "item_fk"))
	@JsonManagedReference("order_ordersitems")
	private Set<Item> items = new HashSet<Item>();
	
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



	


	public RestaurantLocation getRestaurantLocation() {
		return restaurantLocation;
	}

	public void setRestaurantLocation(RestaurantLocation restaurantLocation) {
		this.restaurantLocation = restaurantLocation;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public String getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}



	public String getIsComplete() {
		return isComplete;
	}

	public void setIsComplete(String isComplete) {
		this.isComplete = isComplete;
	}

	public String getIsAccpected() {
		return isAccpected;
	}

	public void setIsAccpected(String isAccpected) {
		this.isAccpected = isAccpected;
	}

	public Set<Item> getItems() {
		return items;
	}

	public void setItems(Set<Item> items) {
		this.items = items;
	}

//	@Override
//	public String toString() {
//		return "Orders [orderedDate=" + orderedDate + ", totalPrice="
//				+ totalPrice + ", isComplete=" + isComplete + ", paymentType="
//				+ paymentType + ", restaurantLocation=" + restaurantLocation
//				+ ", address=" + address + ", orderItems=" + orderItems + "]";
//	}

	
	
}
