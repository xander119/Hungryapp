package database.entity;

import java.util.List;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.management.MXBean;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


@Stateless
@LocalBean
@SuppressWarnings("unchecked")
public class RestaurantDAO {
	@PersistenceContext
	EntityManager em;

	public Restaurant createRestaurant(Restaurant r) {
		// TODO Auto-generated method stub#
		if(r.getGeneralManager()!=null){
			//Manager m = (Manager) em.createNamedQuery("Manager.findManagerByEmail").setParameter("email",  r.getGeneralManager().getEmail()).getResultList().get(0);
			//System.out.println(m.getEmail());
			//r.setGeneralManager(m);
		}
		if(r.getLocations()!=null){
			for(RestaurantLocation rl : r.getLocations()){
				rl.setRestaurant(r);
			}
		}
		if(r.getMenus()!=null){
			for(Menu menu : r.getMenus()){
				menu.setRestaurant(r);
			}
		}
		if(r.getOpenHour()!=null){
//			OpenHour oh = em.find(OpenHour.class,r.getOpenHour());
//			oh.setOpenHour(r);
				r.getOpenHour().setRestaurant(r);
		}
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
		List<RestaurantLocation> result = em.createNamedQuery("RestaurantLocation.findLocations").setParameter("id", id).getResultList();
		return result;
	}

	public void deleteARestaurant(int restaurantid) {
		// TODO Auto-generated method stub
		em.remove(em.find(Restaurant.class, restaurantid));
		
	}

	public List<Restaurant> getAllRestaurantLocations() {
		// TODO Auto-generated method stub
		List<Restaurant> results = em.createNamedQuery("Restaurant.findAllLocations").getResultList();
		return results;
	}
}
