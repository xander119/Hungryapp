package webService;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.annotation.security.PermitAll;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import database.entity.CustomerDAO;
import database.entity.ManagerDAO;

@Path("/Login")
@Stateless
public class LoginService {

	@EJB
	private CustomerDAO customerDao;
	@EJB
	private ManagerDAO managerDao;

	@PermitAll
	@GET
	@Path("/{credential}/{password}")
	@Produces(MediaType.APPLICATION_JSON)
	public String login(@PathParam("credential")String credential,@PathParam("password")String password){
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
	@PermitAll
	@GET
	@Path("/admin-{credential}/{password}")
	@Produces(MediaType.APPLICATION_JSON)
	public String adminLogin(@PathParam("credential")String credential,@PathParam("password")String password){
		String result ;
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
		return "{\"result\":\"Unable to Check.\"}";
	}
	
}
