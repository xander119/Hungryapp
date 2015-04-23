package database.entity;

import java.io.Serializable;
import java.lang.String;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;

/**
 * Entity implementation class for Entity: Address
 *
 */
@NamedQueries({ @NamedQuery(name = "Address.findById", query = "Select e from Address e where e.id = :id") })
@Entity
@XmlRootElement
public class Address implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String line1;
	private String line2;
	private String line3;
	private String county;
	@ManyToOne
	@JoinColumn(name = "customer_fk")
	@JsonBackReference("customer_location")
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

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public String getLine1() {
		return line1;
	}

	public void setLine1(String line1) {
		this.line1 = line1;
	}

	public String getLine2() {
		return line2;
	}

	public void setLine2(String line2) {
		this.line2 = line2;
	}

	public String getLine3() {
		return line3;
	}

	public void setLine3(String line3) {
		this.line3 = line3;
	}

	/**
	 * @return the county
	 */
	public String getCounty() {
		return county;
	}

	/**
	 * @param county
	 *            the county to set
	 */
	public void setCounty(String county) {
		this.county = county;
	}
}
