package database.entity;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonManagedReference;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;



/**
 * Entity implementation class for Entity: Restaurant
 *
 */
@NamedQueries({
		@NamedQuery(name = "Restaurant.findRestaurantOwnedById", query = "Select e from Restaurant e where e.generalManager.id = :managerid "),
		@NamedQuery(name = "Restaurant.findMenus", query = "Select o from Menu o where o.restaurant.id = :id"),
		@NamedQuery(name = "Restaurant.findById", query = "Select o from Restaurant o where o.id = :id"),
		@NamedQuery(name = "Restaurant.findActivated", query = "Select l from Restaurant o inner join o.locations l where o.status = 'active' and l.restaurant.id = o.id"),
		@NamedQuery(name = "Restaurant.findAllLocations", query = "Select o from Restaurant o"),
		@NamedQuery(name = "Restaurant.findRestByLocationId", query = "Select o,r from RestaurantLocation r inner join r.restaurant o where r.restaurant.id = o.id and r.id = :id"),
		@NamedQuery(name = "Restaurant.findByItemId", query = "Select distinct r.id from Item i inner join i.menu m join m.restaurant r where r.id= :id"),
		@NamedQuery(name = "Restaurant.deleteById", query = "delete  from Restaurant r where r.id= :id" )
})
@Entity
@XmlRootElement

public class Restaurant implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String name;
	private String status ;
	private String type;
	
	@ManyToOne
	
	@JoinColumn(name="generalManager_id",updatable=false)
	@JsonBackReference("restaurant-manager")
	private Manager generalManager;
	private String logo;
	private String description;
	@OneToMany(mappedBy="restaurant",fetch = FetchType.EAGER,cascade=CascadeType.ALL)
	@OnDelete(action = OnDeleteAction.CASCADE)
	 @Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE})
	@JsonManagedReference("location")
	private Set<RestaurantLocation> locations;
	
	@OneToMany(mappedBy="restaurant",fetch = FetchType.EAGER,cascade = CascadeType.ALL)
	@OnDelete(action = OnDeleteAction.CASCADE)
	@Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE})
	@JsonManagedReference("restaurant-menu")
	private Set<Menu> menus;

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

	

	public Manager getGeneralManager() {
		return generalManager;
	}

	public void setGeneralManager(Manager generalManager) {
		this.generalManager = generalManager;
	}

	public Set<Menu> getMenus() {
		return menus;
	}

	public void setMenus(Set<Menu> menus) {
		this.menus = menus;
	}


	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * @param status the status to set
	 */
	public void setStatus(String status) {
		this.status = status;
	}

	

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	@Override
	public String toString() {
		return "Restaurant [id=" + id + ", name=" + name + ", status=" + status
				+ ", type=" + type + ", generalManager=" + generalManager
				+ ", logo=" + logo + ", " 
				+ ", locations=" + locations + ", menus=" + menus + "]";
	}
	

	

	

	

}
