package restClient;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;

import database.entity.Customer;
import database.entity.Orders;

public class RestEasyClient {
	public static void main(String[] args) {
		Customer customer = new Customer();
		customer.setEmail("wang");
		customer.setUsername("Xnader119");
		customer.setFirstname("wang");
		customer.setSurname("Zechen");
		customer.setPassword("111");
		Orders o = new Orders ();
		Set<Orders> orders = new HashSet<Orders>();
		orders.add(o);
		customer.setOrders(orders);
			try {
				ResteasyClient client = new ResteasyClientBuilder().build();
				ResteasyWebTarget target = client
						.target("http://localhost:8080/Hungryapp/rest/members/register");
				Response response = target.request().post(
						Entity.entity(customer, "application/json"));
				if (response.getStatus() != 200) {
					throw new RuntimeException("Failed : HTTP error code : "
							+ response.getStatus());
				}
				System.out.println("Server response : \n");
				System.out.println(response.readEntity(String.class));
				response.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
	}
}
