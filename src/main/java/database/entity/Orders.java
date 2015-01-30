package database.entity;

import java.io.Serializable;
import java.util.ArrayList;
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
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;


/**
 * Entity implementation class for Entity: Order
 *
 */
@Entity

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
	private RestaurantLocation restaurant;
	@ManyToOne
	private Customer customer;
	
	@OneToMany(mappedBy="order")
	private List<Orders_Items> orderItems = new ArrayList<Orders_Items>();
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

	public RestaurantLocation getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(RestaurantLocation restaurant) {
		this.restaurant = restaurant;
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

	public List<Orders_Items> getItems() {
		return orderItems;
	}

	public void setItems(List<Orders_Items> items) {
		this.orderItems = items;
	}

	
}
