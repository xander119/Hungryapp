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
		if(r.getMenus()!=null){
			for(Menu menu : r.getMenus()){
				menu.setRestaurant(r);
				for(Item i : menu.getItems()){
					i.setMenu(menu);
				}
			}
		}
		
		r = em.merge(r);
		return r;

	}
	
	public RestaurantLocation createLocationForRest(RestaurantLocation rl,int restaurantId){
		if(restaurantId!=0){
			Restaurant r = (Restaurant) em.createNamedQuery("Restaurant.findById").setParameter("id",  restaurantId).getResultList().get(0);
			if(r!=null){
				rl.setRestaurant(r);
			}
		}
		if(rl.getOpenHour()!=null){
			rl.getOpenHour().setRestaurantLocation(rl);
		}
		
		em.persist(rl);
		em.flush();
		return rl;
		
	}
	public RestaurantLocation updateLocationForRest(RestaurantLocation rl,int restaurantId){
		if(restaurantId!=0){
			Restaurant r = (Restaurant) em.createNamedQuery("Restaurant.findById").setParameter("id",  restaurantId).getResultList().get(0);
			if(r!=null){
				rl.setRestaurant(r);
			}
		}
		if(rl.getOpenHour()!=null){
			rl.getOpenHour().setRestaurantLocation(rl);
		}
		
		em.merge(rl);
		return rl;
		
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

	

	public List<RestaurantLocation> getBranchRestaurantsById(int id) {
		// TODO Auto-generated method stub
		List<RestaurantLocation> result = em.createNamedQuery("RestaurantLocation.findLocations").setParameter("id", id).getResultList();
		return result;
	}

	public void deleteARestaurant(int restaurantid) {
		// TODO Auto-generated method stub
		em.createNamedQuery("Restaurant.deleteById").setParameter("id", restaurantid).executeUpdate();
		//em.flush();
		System.out.println("deleted" + restaurantid);
		
	}
	public List<Restaurant> getRestaurantByLocationId(int id){
		
		List<Restaurant> results = em.createNamedQuery("Restaurant.findRestByLocationId").setParameter("id", id).getResultList();
		
		return results;
	}
	public List<RestaurantLocation> getAllLocations() {
		// TODO Auto-generated method stub
		List<RestaurantLocation> results = em.createNamedQuery("Restaurant.findActivated").getResultList();
		return (List<RestaurantLocation>) results;
	}
	

	public Restaurant getRestaurantByItemId(int itemId) {
		// TODO Auto-generated method stub
		Restaurant r = (Restaurant) em.createNamedQuery("Restaurant.findByItemId").setParameter("id",  itemId).getResultList().get(0);
		return r;
	}


	public List<Review> getRestaurantReviewsById(int id) {
		// TODO Auto-generated method stub
		List<Review> r = (List<Review>) em.createNamedQuery("RestaurantLocation.findReviews").setParameter("id",  id).getResultList();
		return r;
	}

	public void deleteARestaurantLocation(int locationid) {
		// TODO Auto-generated method stub
		em.createNamedQuery("RestaurantLocation.deleteById").setParameter("id", locationid).executeUpdate();
		System.out.println("deleted" + locationid);
	}
}
