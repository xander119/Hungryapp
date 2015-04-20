package database.entity;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonManagedReference;

/**
 * Entity implementation class for Entity: RestaruantLocation
 *
 */
@NamedQueries({
		@NamedQuery(name = "RestaurantLocation.findOrders", query = "Select o from Orders o where o.restaurantLocation.id = :id"),
		@NamedQuery(name = "RestaurantLocation.findLocations", query = "Select o from RestaurantLocation o where o.restaurant.id = :id"),
		@NamedQuery(name = "RestaurantLocation.findAll", query = " Select o from RestaurantLocation o ") })
@Entity
public class RestaurantLocation implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private Double latitude;
	private String address;
	private String telephone;
	private String email;
	private Double longitude;

	@ManyToOne
	@JsonBackReference("location")
//	@JsonIgnore
	@JoinColumn(name="restaurant_id")
	private Restaurant restaurant;

	@OneToMany(mappedBy = "restaurantLocation", cascade = CascadeType.ALL)
	@JsonManagedReference("orders")
	private Set<Orders> orders = new HashSet<Orders>();

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

	@JsonIgnore
	public Set<Orders> getOrders() {
		return orders;
	}

	public void setOrders(Set<Orders> orders) {
		this.orders = orders;
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


}
