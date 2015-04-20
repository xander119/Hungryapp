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
	public String login(@PathParam("credential")String credential,String password){
		String result ;
		try {
			
			result = customerDao.validateLoginUser(credential,password);
			return result;
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			
		} catch (InvalidKeySpecException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "{\"result\":\"Unable to Check.\"}";
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
	public Manager adminLogin(@PathParam("credential")String credential,String password){
		Manager result = null ;
		try {
			
			result = managerDao.validateUser(credential,password);
			return result;
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			
		} catch (InvalidKeySpecException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}
	
}
