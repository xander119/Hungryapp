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
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import database.entity.Orders;
import database.entity.OrdersDAO;

@Path("/order")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
public class OrderService {
	@EJB
	private OrdersDAO ordersDao;
	@EJB
	private RequestInterceptor interceptor;
	
	@POST
	@Path("/createOrder/{locationId}-{custId}-{addressId}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response newOrder(Orders order,@PathParam("locationId") int locationId,@PathParam("custId") int custId,@PathParam("addressId") int addressId,@Context HttpHeaders hHeaders){
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin","customer"})), hHeaders)){
			return Response.status(200).entity( ordersDao.createOrder(order,locationId,custId,addressId)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
		
	}
	@GET
	@Path("/{orderid}")
	public Response getOrder(@PathParam("orderid") int orderid,@Context HttpHeaders hHeaders){
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin","customer"})), hHeaders)){
			return  Response.status(200).entity(ordersDao.getOrderById(orderid)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@POST
	@Path("/accpectOrder/{orderid}")
	public Response accpectOrder(@PathParam("orderid") int orderid,@Context HttpHeaders hHeaders){
		
		return  Response.status(200).entity(ordersDao.accpectOrder(orderid)).build();
	}
	@GET
	@Path("/pendingOrders/{custId}")
	public Response getPendingOrders(@PathParam("custId") int custId,@Context HttpHeaders hHeaders){
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin","customer"})), hHeaders)){
			return  Response.status(200).entity(ordersDao.getPendingOrders(custId)).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@GET
	@Path("/allOrders")
	public Response getAllOrder(@Context HttpHeaders hHeaders){
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin","customer"})), hHeaders)){
			return  Response.status(200).entity(ordersDao.getAllOrders()).build();
		}
		return Response.status(401).entity("Unauthorized").build();
	}
	@DELETE
	@Path("/delete/{orderid}")
	public Response deleteOrder(@Context HttpHeaders hHeaders,@PathParam("orderid")int orderid ){
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin","customer"})), hHeaders)){
			ordersDao.removeOrder(orderid);
			return Response.status(200).entity("{ \"result\": \"Deleted\"}").build();
		}
		return Response.status(401).entity("Unauthorized").build();
		
	}
}
