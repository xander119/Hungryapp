package database.entity;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonManagedReference;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Entity implementation class for Entity: RestaruantLocation
 *
 */
@NamedQueries({
		@NamedQuery(name = "RestaurantLocation.findOrders", query = "Select o from Orders o where o.restaurantLocation.id = :id"),
		@NamedQuery(name = "RestaurantLocation.findReviews", query = "Select o from Review o where o.restaurantLocation.id = :id"),
		@NamedQuery(name = "RestaurantLocation.findLocations", query = "Select o from RestaurantLocation o where o.restaurant.id = :id"),
		@NamedQuery(name = "RestaurantLocation.findAll", query = " Select o from RestaurantLocation o "),
		@NamedQuery(name = "RestaurantLocation.findById", query = " Select o from RestaurantLocation o where o.id = :id"),
		@NamedQuery(name = "RestaurantLocation.deleteById", query = " delete from RestaurantLocation o where o.id = :id")
		})
@Entity
@XmlRootElement
public class RestaurantLocation implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private Double latitude;
	private String address;
	private String telephone;
	private String email;
	private Double longitude;
	@OneToOne(mappedBy="restaurantLocation",cascade=CascadeType.ALL)
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JsonManagedReference("openhour")
	private OpenHour openHour;

	private String deliveryHour;
	

	private String deliveryNote;
	@OneToMany(mappedBy = "restaurantLocation", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JsonManagedReference("restaurantLocation_orders")
	private Set<Orders> orders ;
	@Column(nullable=true)
	@OneToMany(mappedBy="restaurantLocation",fetch=FetchType.EAGER,cascade = CascadeType.ALL)
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JsonManagedReference("restaurant_review")
	private Set<Review> reviews;
	@ManyToOne
	@JsonBackReference("location")
	@JoinColumn(name="restaurant_id")
	private Restaurant restaurant;
	
	

	private static final long serialVersionUID = 1L;
	
	public RestaurantLocation() {
		super();
	}

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Double getLatitude() {
		return this.latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Restaurant getRestaurant() {
		return this.restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}

	

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public String getDeliveryHour() {
		return deliveryHour;
	}

	public void setDeliveryHour(String deliveryHour) {
		this.deliveryHour = deliveryHour;
	}

	public String getDeliveryNote() {
		return deliveryNote;
	}

	public void setDeliveryNote(String deliveryNote) {
		this.deliveryNote = deliveryNote;
	}

	public OpenHour getOpenHour() {
		return openHour;
	}

	public void setOpenHour(OpenHour openHour) {
		this.openHour = openHour;
	}

	public Set<Orders> getOrders() {
		return orders;
	}

	public void setOrders(Set<Orders> orders) {
		this.orders = orders;
	}

	public Set<Review> getReviews() {
		return reviews;
	}

	public void setReviews(Set<Review> reviews) {
		this.reviews = reviews;
	}


}
