package webService;

import java.util.List;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import database.entity.Manager;
import database.entity.ManagerDAO;
import database.entity.RestaurantLocation;

@Path("/admin")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
public class AdminServices {
	@EJB
	private ManagerDAO managerDao;
	
	
	@POST
	@Path("/registerAsOwner")
	public Manager registerAdmin(Manager m){
		return managerDao.registerAdmin(m);
	}
	@GET
	@Path("/myRestaurant/{managerid}")
	public List<RestaurantLocation> getRestaurantOwnedById(@PathParam("managerid")int managerid){
		return managerDao.getRestaurantByManagerId(managerid);
	}
}
