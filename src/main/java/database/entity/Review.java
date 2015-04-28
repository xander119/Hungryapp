package database.entity;

import database.entity.Customer;
import database.entity.RestaurantLocation;

import java.io.Serializable;
import java.lang.String;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;

/**
 * Entity implementation class for Entity: Review
 *
 */
@NamedQueries({
//	@NamedQuery(name = "Review.findMenus", query = "Select o from Review o where o.Review.id = :id"),
	@NamedQuery(name = "Review.findById", query = "Select o from Review o where o.id = :id"),
//	@NamedQuery(name = "Review.findActivated", query = "Select l from Review o inner join o.locations l where o.status = 'active' and l.Review.id = o.id"),
//	@NamedQuery(name = "Review.findAllLocations", query = "Select o from Review o"),
//	@NamedQuery(name = "Review.findRestByLocationId", query = "Select o,r from ReviewLocation r inner join r.Review o where r.Review.id = o.id and r.id = :id"),
//	@NamedQuery(name = "Review.findByItemId", query = "Select distinct r.id from Item i inner join i.menu m join m.Review r where r.id= :id"),
//	@NamedQuery(name = "Review.deleteById", query = "delete  from Review r where r.id= :id" )
})
@Entity
@XmlRootElement
public class Review implements Serializable {

	   
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private int rate;
	private String comment;
	private String createDate;
	private String username;
	@ManyToOne
	@JoinColumn(name="customer_id")
	@JsonBackReference("customer_review")
	private Customer customer;
	@ManyToOne
	@JoinColumn(name="restaurantLocation_id")
	@JsonBackReference("restaurant_review")
	private RestaurantLocation restaurantLocation;
	private static final long serialVersionUID = 1L;

	public Review() {
		super();
	}   
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}   
	public int getRate() {
		return this.rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}   
	public String getComment() {
		return this.comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}   
	public Customer getCustomer() {
		return this.customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}   
	public RestaurantLocation getRestaurantLocation() {
		return this.restaurantLocation;
	}

	public void setRestaurantLocation(RestaurantLocation restaurantLocation) {
		this.restaurantLocation = restaurantLocation;
	}
	public String getCreateDate() {
		return createDate;
	}
	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
   
}
