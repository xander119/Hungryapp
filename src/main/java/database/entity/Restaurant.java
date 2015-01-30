package database.entity;

import database.entity.RestaurantLocation;

import java.io.Serializable;
import java.lang.Integer;
import java.lang.String;
import java.util.Set;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Restaurant
 *
 */
@Entity

public class Restaurant implements Serializable {

	   
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String openHour;
	private String deliveryHour;
	private String name;
	private String type;
	@Lob
	private byte[] logo;
	@OneToMany(cascade= CascadeType.ALL,mappedBy="restaurant")
	private Set<RestaurantLocation> locations;
	private static final long serialVersionUID = 1L;

	public Restaurant() {
		super();
	}   
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}   
	public String getOpenHour() {
		return this.openHour;
	}

	public void setOpenHour(String openHour) {
		this.openHour = openHour;
	}   
	public String getDeliveryHour() {
		return this.deliveryHour;
	}

	public void setDeliveryHour(String deliveryHour) {
		this.deliveryHour = deliveryHour;
	} 
	
	public Set<RestaurantLocation> getLocations() {
		return this.locations;
	}

	public void setLocations(Set<RestaurantLocation> locations) {
		this.locations = locations;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public byte[] getLogo() {
		return logo;
	}
	public void setLogo(byte[] logo) {
		this.logo = logo;
	}
   
}
