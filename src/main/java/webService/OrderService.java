package webService;

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
import javax.ws.rs.core.MediaType;

import database.entity.Orders;
import database.entity.OrdersDAO;

@Path("/order")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
public class OrderService {
	@EJB
	private OrdersDAO ordersDao;
	
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
	public void deleteOrder(@PathParam("orderid")int orderid ){
		ordersDao.removeOrder(orderid);
	}
}
