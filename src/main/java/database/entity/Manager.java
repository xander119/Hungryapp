package database.entity;

import java.io.Serializable;
import java.lang.Integer;
import java.lang.String;
import java.util.Set;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Entity implementation class for Entity: Administrator
 *
 */
@NamedQueries({
	@NamedQuery(name = "Manager.findRestaurantOwnedById", query = "Select e from Restaurant e where e.generalManager = :manager "),
	@NamedQuery(name = "Manager.allManagers", query = "select e from Manager e "),
	@NamedQuery(name = "Manager.findManagerById", query = "select e from Manager e where e.id = :id "),
	@NamedQuery(name = "Manager.findPassordByEmailOrUsername", query = "Select e.password from Manager e where e.name = :credential or e.email=:credential "),
	@NamedQuery(name = "Manager.findManagerByEmailOrUsername", query = "Select e from Manager e where e.name = :credential or e.email=:credential")
	})
@Entity
@XmlRootElement
public class Manager implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String name; 
	private String password;
	private String email;
	@Column(nullable=true)
	@OneToMany(mappedBy="generalManager",fetch=FetchType.EAGER)
	private Set<Restaurant> restaurants;
	private static final long serialVersionUID = 1L;

	public Manager() {
		super();
	}   
	
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}   
	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	public Set<Restaurant> getRestaurants() {
		return restaurants;
	}
	public void setRestaurants(Set<Restaurant> restaurants) {
		this.restaurants = restaurants;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
   
}
