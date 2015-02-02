package database.entity;

import database.entity.Restaurant;

import java.io.Serializable;
import java.lang.Double;
import java.lang.Integer;
import java.util.Set;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: RestaruantLocation
 *
 */
@NamedQueries({
	@NamedQuery(name = "RestaurantLocation.findOrders", query = "Select o from Orders o where o.restaurantLocation.id = :id")	
	})

@Entity
public class RestaurantLocation implements Serializable {

	   
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private Double latitude;
	private Double longtitude;
	
	@ManyToOne
	private Restaurant restaurant;
	@OneToMany(mappedBy="restaurantLocation",cascade=CascadeType.ALL)
	private Set<Orders> orders ;
	
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
	public Double getLongtitude() {
		return this.longtitude;
	}

	public void setLongtitude(Double longtitude) {
		this.longtitude = longtitude;
	}   
	
	public Restaurant getRestaurant() {
		return this.restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
	public Set<Orders> getOrders() {
		return orders;
	}
	public void setOrders(Set<Orders> orders) {
		this.orders = orders;
	}
   
}
