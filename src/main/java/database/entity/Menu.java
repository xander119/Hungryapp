package database.entity;

import database.entity.Item;

import java.io.Serializable;
import java.lang.Integer;
import java.lang.String;
import java.util.Set;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonManagedReference;

/**
 * Entity implementation class for Entity: Menu
 *
 */
@NamedQueries({
	@NamedQuery(name = "Menu.findById", query = "Select e from Menu e where e.id = :id") })
@Entity
@XmlRootElement
public class Menu implements Serializable {

	   
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String name;
	private String note;
	@OneToMany(mappedBy="menu",cascade=CascadeType.ALL,fetch=FetchType.EAGER)
	@JsonManagedReference("item_menu")
	private Set<Item> items;
	@ManyToOne
	@JoinColumn(name="restaurant_id")
	@JsonBackReference("restaurant-menu")
	private Restaurant restaurant;
	private static final long serialVersionUID = 1L;

	public Menu() {
		super();
	}   
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}   
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}   
	public String getNote() {
		return this.note;
	}

	public void setNote(String note) {
		this.note = note;
	}   
	public Set<Item> getItems() {
		return this.items;
	}

	public void setItems(Set<Item> items) {
		this.items = items;
	}
	public Restaurant getRestaurant() {
		return restaurant;
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
   
}
