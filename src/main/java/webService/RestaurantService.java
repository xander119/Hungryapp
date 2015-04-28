package webService;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import database.entity.Menu;
import database.entity.Restaurant;
import database.entity.RestaurantDAO;
import database.entity.RestaurantLocation;
import database.entity.Review;

@Path("/restaurants")
@Stateless
@Produces(MediaType.APPLICATION_JSON)

public class RestaurantService {
	@EJB
	private RestaurantDAO restaurantDao;
	@EJB
	private RequestInterceptor interceptor;
	
	@POST
	@Path("/createRestaurant/{managerid}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createRestaurant(@Context HttpHeaders hHeaders,@PathParam("managerid") int managerid,Restaurant r) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity(restaurantDao.createRestaurant(r, managerid)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@POST
	@Path("/createRestaurantLocation/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createLocationForRest(@Context HttpHeaders hHeaders,@PathParam("id") int id,RestaurantLocation rl){
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity(restaurantDao.createLocationForRest(rl, id)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	
	
	@PUT
	@Path("/updateRestaurant")
	public Response updateRestaurantInfo(@Context HttpHeaders hHeaders,Restaurant r) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity( restaurantDao.update(r)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@PUT
	@Path("/updateRestaurantlocation/{restId}")
	public Response updateRestaurantInfo(@Context HttpHeaders hHeaders,RestaurantLocation r,@PathParam("restId") int restId) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity( restaurantDao.updateLocationForRest(r,restId)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@GET
	@Path("/{id}")
	public Restaurant getRestaurantById(@PathParam("id") int id) {
		return restaurantDao.getRestaurantById(id);

	}
	@GET
	@Path("/item/{itemId}")
	public Response getRestaurantByItemId(@PathParam("itemId") int itemId) {
		return Response.status(200).entity(restaurantDao.getRestaurantByItemId(itemId)).build();

	}

	@GET
	@Path("/{id}/orders")
	public Response getRestaurantOrdersById(@Context HttpHeaders hHeaders,@PathParam("id") int id) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			return Response.status(200).entity(restaurantDao.getRestaurantOrdersById(id)).build();
		}
		return Response.status(401).entity("Unauthorized").build();

	}
	
	@GET
	@Path("/{id}/reviews")
	public List<Review> getRestaurantReviewsById(@PathParam("id") int id) {
		return restaurantDao.getRestaurantReviewsById(id);

	}
	@GET
	@Path("/{id}/menus")
	public List<Menu> getRestaurantMenusById(@PathParam("id") int id) {
		return restaurantDao.getRestaurantMenusById(id);

	}

	@GET
	@Path("/location/{locationid}")
	public List<Restaurant> getBranchRestaurantInfoById(
			@PathParam("locationid") int locationid) {
		return restaurantDao.getRestaurantByLocationId(locationid);
		
	}

	@GET
	@Path("/allrestaurant/locations")
	public List<RestaurantLocation> getAllRestaurantLocations() {
		return restaurantDao.getAllLocations();

	}
//	@GET
//	@Path("/restaurantByLocationId/{locationid}")
//	public Restaurant getRestaurantByLocationId(@PathParam("locationid") int locationid){
//		return restaurantDao.getRestaurantByLocationId(locationid);
//	}

	@GET
	@Path("/{id}/locations")
	public List<RestaurantLocation> getBranchRestaurantsById(
			@PathParam("id") int id) {
		return restaurantDao.getBranchRestaurantsById(id);

	}
	@DELETE
	@Path("/deleteLocation/{locationid}")
	@Produces(MediaType.TEXT_PLAIN)
	public Response deletelocation(@Context HttpHeaders hHeaders,@PathParam("locationid") int locationid) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			restaurantDao.deleteARestaurantLocation(locationid);
			return Response.status(200).entity("{ \"result\": \"Deleted\"}" ).build();
		}
		return Response.status(401).entity("Unauthorized").build();
		
	}
	@DELETE
	@Path("/delete/{restaurantid}")
	@Produces(MediaType.TEXT_PLAIN)
	public Response deleteARestaurant(@Context HttpHeaders hHeaders,@PathParam("restaurantid") int restaurantid) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin"})), hHeaders)){
			restaurantDao.deleteARestaurant(restaurantid);
			return Response.status(200).entity("{ \"result\": \"Deleted\"}" ).build();
		}
		return Response.status(401).entity("Unauthorized").build();
		
	}
}
