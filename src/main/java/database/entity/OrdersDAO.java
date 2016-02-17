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
	
	public Orders createOrder(Orders order, int locationId,int custId,int addressId, int itemId2) {
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
			
//			
			if(order.getOrderItems()!=null)
			{
				for(Orders_Items oi : order.getOrderItems()){
					oi.setOrder(order);
					int itemId = oi.getItem().getId();
					Item item = (Item) em.createNamedQuery("Item.findById").setParameter("id",  itemId).getResultList().get(0);
					itemList.append(item.getName() + "\t \t ID: " + item.getId() + "\t \t \t \t Quantity: " + oi.getQuantity());
					oi.setItem(item);
				}
			}
			
			System.out.println(order.getPaymentType());
			String dateString = new SimpleDateFormat("dd/MM/yy/HH/mm").format(new Date());
			order.setOrderedDate(dateString);
			order.setIsAccpected("pending");
			//em.persist(order);
			String body = itemList + "\n \n" + "Customer is waiting for Delivery.\n\n";
			email.sendEmail(r.getEmail(), "New Order", body);
			em.flush();

			return order;
		}
		return null;
	}

	public Object getOrderById(int orderid) {
		// TODO Auto-generated method stub
		List<Object> o = (List<Object>) em.createNamedQuery("Orders.findById").setParameter("id", orderid).getResultList();
		List<Item> i = (List<Item>) em.createNamedQuery("Orders.findItemInOrderById").setParameter("id", orderid).getResultList();
		System.out.println(i.size());
		for (Item item : i ){
			System.out.println(item.getName());
		}
		if(o!=null){
		
			return o.get(0);
		}
				
		return null;
	}
	public List<Object> getPendingOrdersByCustomerId(int custId) {
		// TODO Auto-generated method stub
		
		List<Object> o;
		o = em.createNamedQuery("Orders.getPendingOrders").setParameter("id", custId).getResultList();
		
		return o;
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
