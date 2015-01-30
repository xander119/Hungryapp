package webService;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
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

import database.entity.Customer;
import database.entity.CustomerDAO;
import database.entity.Orders;

@Path("/members")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
public class MembersService {
	@EJB
	private CustomerDAO customerDao;
	
	/**
     * Returns registered customer if success,otherwise return null indicate customer already exist
     *
     * @param   customer    the customer to register
     * @return              customer object
	 * @throws InvalidKeySpecException 
	 * @throws NoSuchAlgorithmException 
     */
	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Customer registerCustomer(Customer c) throws NoSuchAlgorithmException, InvalidKeySpecException{
		//register and log in (log in in AngularJS)
		//return null if customer already exist validate existing email and userName
		if(customerDao.createCustomer(c)){
			return c;
		}
		return null;
	}
	
	@GET
	@Path("/myInfo")
	public Customer getCustomerByID(int userid) {
		return customerDao.getCustomerByID(userid);
	}
	
	@GET
	@Path("/orders/")
	public List<Orders> getCustomerOrderHistory(int userid) {
		return customerDao.getCustomerOrdersById(userid);
	}
	
	
	@PUT
	@Path("/updateInfo")
	public void updateCustomerDetails(Customer c){
		 customerDao.updateCustomer(c);
	}
	@DELETE
	@Path("/delete")
	public void deleteACustomer(int userid){
		customerDao.deleteCustomer(userid);
	}
	
	
	
	
	
	
	
}
