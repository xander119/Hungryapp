package database.entity;

import java.io.Serializable;
import java.lang.String;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;



/**
 * Entity implementation class for Entity: OpenHour
 *
 */
@Entity
@XmlRootElement
public class OpenHour implements Serializable {

	   
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;
	private String monday;
	private String tuesday;
	private String wednesday;
	private String thursday;
	private String friday;
	private String saturday;
	private String sunday;
	@OneToOne
	@JoinColumn(name="restaurant_id")
	@JsonBackReference("openhour")
	private Restaurant  restaurant;
	private static final long serialVersionUID = 1L;

	public OpenHour() {
		super();
	}   
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}   
	public String getMonday() {
		return this.monday;
	}

	public void setMonday(String monday) {
		this.monday = monday;
	}   
	public String getTuesday() {
		return this.tuesday;
	}

	public void setTuesday(String tuesday) {
		this.tuesday = tuesday;
	}   
	public String getWednesday() {
		return this.wednesday;
	}

	public void setWednesday(String wednesday) {
		this.wednesday = wednesday;
	}   
	public String getThursday() {
		return this.thursday;
	}

	public void setThursday(String thursday) {
		this.thursday = thursday;
	}   
	public String getFriday() {
		return this.friday;
	}

	public void setFriday(String friday) {
		this.friday = friday;
	}   
	public String getSaturday() {
		return this.saturday;
	}

	public void setSaturday(String saturday) {
		this.saturday = saturday;
	}   
	public String getSunday() {
		return this.sunday;
	}

	public void setSunday(String sunday) {
		this.sunday = sunday;
	}
	public Restaurant getRestaurant() {
		return restaurant;
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
	
	
   
}
