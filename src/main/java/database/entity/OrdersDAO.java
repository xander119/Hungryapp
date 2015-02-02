package database.entity;

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

	public Orders createOrder(Orders order) {
		// TODO Auto-generated method stub
		if(order!=null){
			em.persist(order);
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
