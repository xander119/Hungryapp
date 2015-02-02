package database.entity;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


@Stateless
@LocalBean
@SuppressWarnings("unchecked")
public class RestaurantDAO {
	@PersistenceContext
	EntityManager em;

	public Restaurant createRestaurant(Restaurant r) {
		// TODO Auto-generated method stub
		em.persist(r);
		return r;

	}

	public Restaurant update(Restaurant r) {
		// TODO Auto-generated method stub

		return em.merge(r);
	}

	public Restaurant getRestaurantById(int id) {
		// TODO Auto-generated method stub

		return em.find(Restaurant.class, id);
	}

	public List<Orders> getRestaurantOrdersById(int id) {
		// TODO Auto-generated method stub
		List<Orders> orders = em.createNamedQuery(
				"RestaurantLocation.findOrders").getResultList();
		return orders;
	}

	public List<Menu> getRestaurantMenusById(int id) {
		// TODO Auto-generated method stub
		List<Menu> meuns = em.createNamedQuery(
				"Restaurant.findMenus").getResultList();
		return meuns;
	}

	public RestaurantLocation getBranchRestaurantInfoById(int locationid) {
		// TODO Auto-generated method stub
		
		return em.find(RestaurantLocation.class, locationid);
	}

	public List<RestaurantLocation> getBranchRestaurantsById(int id) {
		// TODO Auto-generated method stub
		List<RestaurantLocation> result = em.createNamedQuery("Restaurant.findLocations").setParameter("id", id).getResultList();
		return result;
	}

	public void deleteARestaurant(int restaurantid) {
		// TODO Auto-generated method stub
		em.remove(em.find(Restaurant.class, restaurantid));
		
	}
}
