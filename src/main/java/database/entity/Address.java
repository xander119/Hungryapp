package database.entity;

import java.io.Serializable;
import java.lang.String;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Entity implementation class for Entity: Address
 *
 */
@Entity
@XmlRootElement
public class Address implements Serializable {

	   
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String Number;
	private String street;
	private String town;
	private String country;
	@ManyToOne
	private Customer customer;
	private static final long serialVersionUID = 1L;

	public Address() {
		super();
	}   
	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}   
	public String getNumber() {
		return this.Number;
	}

	public void setNumber(String Number) {
		this.Number = Number;
	}   
	public String getStreet() {
		return this.street;
	}

	public void setStreet(String street) {
		this.street = street;
	}   
	   
	
	public Customer getCustomer() {
		return customer;
	}
	public void setCustomer(Customer customer) {
		this.customer = customer;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getTown() {
		return town;
	}
	public void setTown(String town) {
		this.town = town;
	}
   
}
