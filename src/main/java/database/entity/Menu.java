package database.entity;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.CascadeType;
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
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonManagedReference;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

/**
 * Entity implementation class for Entity: Menu
 *
 */
@NamedQueries({
	@NamedQuery(name = "Menu.findById", query = "Select e from Menu e where e.id = :id"),
	@NamedQuery(name = "Menu.findByRestId", query = "Select e from Menu e where e.restaurant.id = :id"),
	@NamedQuery(name = "Menu.deleteById", query = "delete  from Menu o where o.id = :id")

	})
@Entity
@XmlRootElement
public class Menu implements Serializable {

	   
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String name;
	private String note;
	@OneToMany(mappedBy="menu",fetch=FetchType.EAGER,cascade=CascadeType.ALL)
	@OnDelete(action = OnDeleteAction.CASCADE)
	@JsonManagedReference("item_menu")
	private Set<Item> items;
	@ManyToOne
	@JoinColumn(name="restaurant_id")
	@OnDelete(action = OnDeleteAction.CASCADE)
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
