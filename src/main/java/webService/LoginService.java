package webService;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import database.entity.Customer;
import database.entity.CustomerDAO;
import database.entity.Manager;
import database.entity.ManagerDAO;

@Path("/Login")
@Stateless
@Consumes(MediaType.APPLICATION_JSON)
public class LoginService {

	@EJB
	private CustomerDAO customerDao;
	@EJB
	private ManagerDAO managerDao;

	@POST
	@Path("/{credential}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(@PathParam("credential")String credential,String password){
		Customer result ;
		try {
			
			result = customerDao.validateLoginUser(credential,password);
			if(result==null){
				return Response.status(400).entity("{\"result\":\"Incorrect Password or username.\"}").build();
				
			}
			return Response.status(200).entity(result).build();
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			
		} catch (InvalidKeySpecException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(400).entity("Error").build();
	}
//	@GET
//	@Path("/{credential}")
//	@Produces(MediaType.APPLICATION_JSON)
//	public String checkLoggedinUser(@Context HttpHeaders hHeaders,@PathParam("credential")String credential){
//		Customer result ;
//		result = customerDao.getCustomerByEmailOrUsername(credential);
//			
//			if(result != null)
//				return "{\"result\":\"success\"}";
//			else
//				return "{\"result\":\"false\"}";
//			//return result;
//		
//	}
	@POST
	@Path("/admin-{credential}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response adminLogin(@PathParam("credential")String credential,String password){
		Manager result = null ;
		try {
			
			result = managerDao.validateUser(credential,password);
			if(result == null){
				return Response.status(400).entity("{\"result\":\"Incorrect Password or username.\"}").build();
			}
			return Response.status(200).entity(result).build();
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			
		} catch (InvalidKeySpecException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.status(400).entity("{\"result\":\"Unable to Check.\"}").build();
	}
	
}
