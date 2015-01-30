package webService;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import database.entity.Manager;
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
	public void createRestaurant(Restaurant r){
		
	}
	
	@PUT
	@Path("/updateRestaurant")
	public void updateRestaurantInfo(Restaurant r){
		
	}
	@GET
	@Path("/{id}")
	public Restaurant getRestaurantById(@PathParam("id")int id){
		return null;
		
	}
	@GET
	@Path("/{id}/orders/{orderid}")
	public Restaurant getRestaurantOrdersById(@PathParam("id")int id,@PathParam("orderid")int orderid){
		return null;
		
	}
	@GET
	@Path("/{id}/menus/{menuid}")
	public Restaurant getRestaurantMenusById(@PathParam("id")int id,@PathParam("menuid")int menuid){
		return null;
		
	}
	@GET
	@Path("/{id}/locations/{locationid}")
	public Restaurant getBranchRestaurantsById(@PathParam("id")int id,@PathParam("locationid")int locationid){
		return null;
		
	}
	@DELETE
	@Path("/delete/{restaurantid}")
	public void deleteARestaurant(@PathParam("restaurantid")int restaurantid){
		
	}
}
