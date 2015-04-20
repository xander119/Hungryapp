package webService;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import javax.annotation.security.RolesAllowed;
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
@RolesAllowed({"customer","admin"})
public class OrderService {
	@EJB
	private OrdersDAO ordersDao;
	@EJB
	private RequestInterceptor interceptor;
	
	@POST
	@Path("/createOrder")
	@Consumes(MediaType.APPLICATION_JSON)
	public Orders newOrder(Orders order){
		return ordersDao.createOrder(order);
	}
	@GET
	@Path("/{orderid}")
	public Orders getOrder(@PathParam("orderid") int orderid){
		return ordersDao.getOrderById(orderid);
	}
	@GET
	@Path("/allOrders")
	public List<Orders> getAllOrder(){
		return ordersDao.getAllOrders();
	}
	@DELETE
	@Path("/delete/{orderid}")
	public Response deleteOrder(@Context HttpHeaders hHeaders,@PathParam("orderid")int orderid ){
		if(interceptor.process(new HashSet<String>(Arrays.asList(new String[]{"admin","customer"})), hHeaders)){
			ordersDao.removeOrder(orderid);
			return Response.status(200).entity("removed").build();
		}
		return Response.status(401).entity("Unauthorized").build();
		
	}
}
