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

	public Restaurant createRestaurant(Restaurant r, int managerid) {
		// TODO Auto-generated method stub#
		if(managerid!=0){
			Manager m = (Manager) em.createNamedQuery("Manager.findManagerById").setParameter("id",  managerid).getResultList().get(0);
			r.setGeneralManager(m);
		}
		if(r.getLocations()!=null){
			for(RestaurantLocation rl : r.getLocations()){
				rl.setRestaurant(r);
			}
		}
		if(r.getMenus()!=null){
			for(Menu menu : r.getMenus()){
				menu.setRestaurant(r);
				for(Item i : menu.getItems()){
					i.setMenu(menu);
				}
			}
		}
//		if(r.getOpenHour()!=null){
//				r.getOpenHour().setRestaurant(r);
//		}
		System.out.println(r.toString());
		em.persist(r);
		return r;

	}
	
//	public RestaurantLocation createLocationForRest(RestaurantLocation rl,int restaurantId){
//		if(restaurantId==0){
//			Restaurant r = (Restaurant) em.createNamedQuery("Restaurant.findById").setParameter("id",  restaurantId).getResultList().get(0);
//			if(r!=null){
//				rl.setRestaurant(r);
//			}
//		}
//		if(rl.getOpenHour()!=null){
//			rl.getOpenHour().setRestaurantLocation(rl);
//		}
//		System.out.println(rl.toString());
//		em.persist(rl);
//		return rl;
//		
//	}

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

	

	public List<RestaurantLocation> getBranchRestaurantsById(int id) {
		// TODO Auto-generated method stub
		List<RestaurantLocation> result = em.createNamedQuery("RestaurantLocation.findLocations").setParameter("id", id).getResultList();
		return result;
	}

	public void deleteARestaurant(int restaurantid) {
		// TODO Auto-generated method stub
		em.remove(em.find(Restaurant.class, restaurantid));
		
	}
	public Restaurant getRestaurantByLocationId(int id){
		
		List<Restaurant> results = em.createNamedQuery("Restaurant.findRestByLocationId").setParameter("id", id).getResultList();
		
		return results.get(0);
	}
	public List<RestaurantLocation> getAllLocations() {
		// TODO Auto-generated method stub
		List<RestaurantLocation> results = em.createNamedQuery("RestaurantLocation.findAll").getResultList();
		return results;
	}

	public Restaurant getRestaurantByItemId(int itemId) {
		// TODO Auto-generated method stub
		Restaurant r = (Restaurant) em.createNamedQuery("Restaurant.findByItemId").setParameter("id",  itemId).getResultList().get(0);
		return r;
	}
}
