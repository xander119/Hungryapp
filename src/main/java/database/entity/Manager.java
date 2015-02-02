package database.entity;

import java.io.Serializable;
import java.lang.Integer;
import java.lang.String;

import javax.persistence.*;

/**
 * Entity implementation class for Entity: Administrator
 *
 */
@NamedQueries({
	@NamedQuery(name = "Manager.findRestaurantOwnedById", query = "Select e from Restaurant e where e.generalManager = :manager "),
	@NamedQuery(name = "Manager.allManagers", query = "select e from Manager e ")
	})
@Entity

public class Manager implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String Name; 
	private String password;
	private static final long serialVersionUID = 1L;

	public Manager() {
		super();
	}   
	public String getName() {
		return this.Name;
	}

	public void setName(String Name) {
		this.Name = Name;
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
   
}
