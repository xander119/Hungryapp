package database.entity;

import java.util.List;
import java.util.StringTokenizer;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Stateless
@LocalBean
@SuppressWarnings("unchecked")
public class OrdersDAO {
	@PersistenceContext
	EntityManager em;

	private Emailsender email = new Emailsender();
	
	public Orders createOrder(Orders order, String restIdAndCustId) {
		// TODO Auto-generated method stub
		final StringTokenizer tokenizer = new StringTokenizer(restIdAndCustId, ":");
		final int restId = Integer.parseInt(tokenizer.nextToken());
		final int custId = Integer.parseInt(tokenizer.nextToken());
		Customer c;
		RestaurantLocation r = null;
		if(order!=null){
			
			if(restId!=0){
			//	 r = (Restaurant) em.createNamedQuery("RestaurantLocation.findById").setParameter("id",  restId).getResultList().get(0);
				order.setRestaurantLocation(r);
			}
			if(custId!=0){
				 c = (Customer) em.createNamedQuery("Customer.findById").setParameter("id",  custId).getResultList().get(0);
				order.setCustomer(c);
			}
			if(order.getOrderItems()!=null)
			{
				for(Orders_Items oi : order.getOrderItems()){
					oi.setOrder(order);
					int itemId = oi.getItem().getId();
					Item item = (Item) em.createNamedQuery("Item.findById").setParameter("id",  itemId).getResultList().get(0);
					oi.setItem(item);
					
				}
			}
			em.persist(order);
			
			///email.sendEmail(r.get, "New Order ", body);
			return order;
		}
		return null;
	}

	public Orders getOrderById(int orderid) {
		// TODO Auto-generated method stub
		
		return em.find(Orders.class, orderid);
	}

	public List<Orders> getAllOrders() {
		// TODO Auto-generated method stub
		
		List<Orders> orders = em.createNamedQuery("Orders.getAllOrders").getResultList();
		return orders;
	}

	public void removeOrder(int orderid) {
		// TODO Auto-generated method stub
		em.remove(em.find(Orders.class, orderid));
	}
}
