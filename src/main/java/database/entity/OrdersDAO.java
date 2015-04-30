package database.entity;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

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
	
	public Orders createOrder(Orders order, int locationId,int custId,int addressId) {
		// TODO Auto-generated method stub
		Customer c;
		RestaurantLocation r = null;
		Address a ;
		StringBuilder itemList = new StringBuilder();
		
		
		if(order!=null){
			
			if(locationId!=0){
				 r = (RestaurantLocation) em.createNamedQuery("RestaurantLocation.findById").setParameter("id",  locationId).getResultList().get(0);
				order.setRestaurantLocation(r);
			}
			if(custId!=0){
				 c = (Customer) em.createNamedQuery("Customer.findById").setParameter("id",  custId).getResultList().get(0);
				order.setCustomer(c);
			}
			if(addressId!=0){
				a = (Address) em.createNamedQuery("Address.findById").setParameter("id", addressId).getResultList().get(0);
				order.setAddress(a);
			}
			if(order.getOrderItems()!=null)
			{
				for(Orders_Items oi : order.getOrderItems()){
					oi.setOrder(order);
					int itemId = oi.getItem().getId();
					Item item = (Item) em.createNamedQuery("Item.findById").setParameter("id",  itemId).getResultList().get(0);
//					itemList.append("\n"+item.getName() + "\t " + item.getPrice());
					oi.setItem(item);
				}
			}
			System.out.println(order.getPaymentType());
			String dateString = new SimpleDateFormat("dd/MM/yy/HH/mm").format(new Date());
			order.setOrderedDate(dateString);
			order.setIsAccpected("pending");
			em.persist(order);
			em.flush();
//			
//			String orderDetails = "Payment type: "+ order.getPaymentType() + "\nOrder Date: "+ order.getOrderedDate() + "\nItems: \n" + itemList.toString();
//			String body = "\n New Order from Hungry: \n \n "
//					+ orderDetails
//					+ "\n\n\n accpect: "
//					+ " http://localhost:8080/Hungryapp/rest/order/accpectOrder/"
//					+ order.getId() + "\n\n\n Decline: ";
//			
//			email.sendEmail(r.getEmail(), "New Order ", body);
			return order;
		}
		return null;
	}

	public Orders getOrderById(int orderid) {
		// TODO Auto-generated method stub
		
		return em.find(Orders.class, orderid);
	}
	public List<Orders> getPendingOrdersByCustomerId(int custId) {
		// TODO Auto-generated method stub
		
		List<Orders> orders;
		try {
			orders = em.createNamedQuery("Orders.getPendingOrders").setParameter("id", custId).getResultList();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return null;
		}
		return orders;
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

	public Orders accpectOrder(int orderid) {
		// TODO Auto-generated method stub
		Orders o = (Orders) em.createNamedQuery("Orders.findById").setParameter("id", orderid).getResultList().get(0);
		o.setIsAccpected("accpected");
		em.merge(o);
		return o;
	}

	public List<Orders> getPendingOrdersByRestaurantLocation(int locationId) {
		
		// TODO Auto-generated method stub
		return null;
	}
}
