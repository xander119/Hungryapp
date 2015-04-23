package webService;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.HashSet;

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

import database.entity.Address;
import database.entity.Customer;
import database.entity.CustomerDAO;

@Path("/members")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
public class MembersService {
	@EJB
	private CustomerDAO customerDao;
	@EJB
	private RequestInterceptor interceptor;
	
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
	public Response  register(Customer c) throws NoSuchAlgorithmException, InvalidKeySpecException{
		//register and log in (log in in AngularJS)
		//return null if customer already exist validate existing email and userName
		if(customerDao.createCustomer(c)){
			return Response.status(200).entity(c).build();
		}
		return Response.status(500).entity("Error").build();
	}
	
	@GET
	@Path("/myInfo/{id}")
	public Response getCustomerByID(@Context HttpHeaders hHeaders,@PathParam("id")int userid) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"customer"})), hHeaders)){
			return Response.status(200).entity(customerDao.getCustomerByID(userid)).build();
		}
		
		return Response.status(401).entity("Unauthorized").build();
	}
	@GET
	@Path("/orders/{id}")
	public Response getCustomerOrderHistory(@Context HttpHeaders hHeaders,@PathParam("id")int userid) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"customer"})), hHeaders)){
			return Response.status(200).entity(customerDao.getCustomerOrdersById(userid)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@GET
	@Path("/email/{email}")
	public Response getCustomerByEmail(@Context HttpHeaders hHeaders,@PathParam("email")String email) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"customer"})), hHeaders)){
			return Response.status(200).entity( customerDao.getCustomerByEmailOrUsername(email)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	
	@POST
	@Path("/createAddress/{custId}")
	public Response createAddress(@Context HttpHeaders hHeaders,@PathParam("custId")int custId, Address a) {
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"customer"})), hHeaders)){
			return Response.status(200).entity( customerDao.createAddress(a,custId)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@DELETE
	@Path("/deleteAddress/{addrId}")
	public Response deleteAddress(@Context HttpHeaders hHeaders, @PathParam("addrId")int addrId) {
		Address result = null;
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"customer"})), hHeaders)){
			result = customerDao.deleteAddress(addrId);
			if(result !=null)
				return Response.status(200).entity(result).build();
			else
				return Response.status(404).entity(result + "No Address found.").build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	
	@PUT
	@Path("/updateInfo")
	@Consumes(MediaType.APPLICATION_JSON)
	public Customer updateCustomerDetails(@Context HttpHeaders hHeaders,Customer c){
		return customerDao.updateCustomer(c);
	}
	@DELETE
	@Path("/delete/{id}")
	public void deleteACustomer(@Context HttpHeaders hHeaders,@PathParam("id")int userid){
		customerDao.deleteCustomer(userid);
	}
	
	
	
	
	
	
	
}
