package database.entity;

import database.entity.RestaurantLocation;

import java.io.Serializable;
import java.lang.Integer;
import java.lang.String;
import java.util.Set;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonManagedReference;



/**
 * Entity implementation class for Entity: Restaurant
 *
 */
@NamedQueries({
		@NamedQuery(name = "Restaurant.findRestaurantOwnedById", query = "Select e from Restaurant e where e.generalManager.id = :managerid "),
		@NamedQuery(name = "Restaurant.findMenus", query = "Select o from Menu o where o.restaurant.id = :id"),
		@NamedQuery(name = "Restaurant.findAllLocations", query = "Select o from Restaurant o"),
		@NamedQuery(name = "Restaurant.findRestByLocationId", query = "Select o from RestaurantLocation r inner join r.restaurant o where r.restaurant.id = o.id and r.id = :id"),
})
@Entity
@XmlRootElement
public class Restaurant implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String name;
	private String deliveryHour;
	private String deliveryNote;
	private String status ;
	private String type;
	@ManyToOne
	@JoinColumn(name="generalManager_id")
	@JsonIgnore
	private Manager generalManager;
	@Lob
	@Column(columnDefinition="LONGBLOB")
	private byte[] logo;
	
	
	@OneToOne(mappedBy="restaurant",cascade=CascadeType.ALL)
	@JsonManagedReference("openhour")
	private OpenHour openHour;
	@OneToMany(mappedBy="restaurant",cascade = CascadeType.ALL,fetch = FetchType.EAGER)
	@JsonManagedReference("location")
	private Set<RestaurantLocation> locations;
	@OneToMany(mappedBy="restaurant", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
	@JsonIgnore
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

	public OpenHour getOpenHour() {
		return openHour;
	}

	public void setOpenHour(OpenHour openHour) {
		this.openHour = openHour;
	}

	public String getDeliveryNote() {
		return deliveryNote;
	}

	public void setDeliveryNote(String deliveryNote) {
		this.deliveryNote = deliveryNote;
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

	

}
