package webService;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import database.entity.Manager;
import database.entity.Menu;
import database.entity.Orders;
import database.entity.Restaurant;
import database.entity.RestaurantDAO;
import database.entity.RestaurantLocation;

@Path("/restaurants")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
public class RestaurantService {
	@EJB
	private RestaurantDAO restaurantDao;
	
	@POST
	@Path("/createRestaurant")
	@Consumes(MediaType.APPLICATION_JSON)
	public Restaurant createRestaurant(Restaurant r){
		
		return restaurantDao.createRestaurant(r);
	}
	
	@PUT
	@Path("/updateRestaurant")
	public Restaurant updateRestaurantInfo(Restaurant r){
		return restaurantDao.update(r);
	}
	@GET
	@Path("/{id}")
	public Restaurant getRestaurantById(@PathParam("id")int id){
		return restaurantDao.getRestaurantById(id);
		
	}
	@GET
	@Path("/{id}/orders")
	public List<Orders> getRestaurantOrdersById(@PathParam("id")int id){
		return restaurantDao.getRestaurantOrdersById(id);
		
	}
	@GET
	@Path("/{id}/menus")
	public List<Menu> getRestaurantMenusById(@PathParam("id")int id){
		return restaurantDao.getRestaurantMenusById(id);
		
	}
	@GET
	@Path("/restaurant/locations/{locationid}")
	public RestaurantLocation getBranchRestaurantInfoById(@PathParam("locationid")int locationid){
		return restaurantDao.getBranchRestaurantInfoById(locationid);
		
	}
	@GET
	@Path("/allrestaurant/locations")
	public List<Restaurant> getAllRestaurantLocations(){
		return restaurantDao.getAllRestaurantLocations();
		
	}
	@GET
	@Path("/{id}/locations")
	public List<RestaurantLocation> getBranchRestaurantsById(@PathParam("id")int id){
		return restaurantDao.getBranchRestaurantsById(id);
		
	}
	@DELETE
	@Path("/delete/{restaurantid}")
	public void deleteARestaurant(@PathParam("restaurantid")int restaurantid){
		restaurantDao.deleteARestaurant(restaurantid);
	}
}
