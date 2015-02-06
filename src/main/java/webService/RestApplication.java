package webService;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("/")
public class RestApplication extends Application {
	private Set<Object> singletons = new HashSet<Object>();
	
	
	public RestApplication() {
		singletons.add(new AdminServices());
		singletons.add(new LoginService());
		singletons.add(new MembersService());
		singletons.add(new MenusServices());
		singletons.add(new OrderService());
		singletons.add(new RestaurantService());
		}


	public void setSingletons(Set<Object> singletons) {
		this.singletons = singletons;
	}
}