package database.entity;

import java.io.IOException;
import java.util.Set;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

public class SimpleOrdersSerializer extends JsonSerializer<Set<Orders>> {

    @Override
    public void serialize(final Set<Orders> collaborations, final JsonGenerator generator,
        final SerializerProvider provider) throws IOException, JsonProcessingException {
        final Set<SimpleOrders> simpleCollaborations = Sets.newHashSet();
        for (final Orders order : collaborations) {
            simpleCollaborations.add(new SimpleOrders(order.getId(), order.getName(),order.getAddress(),order.getCompleteTime(),order.getCustomer()order.getIsAccpected()));                
        }
        generator.writeObject(simpleCollaborations);
    }

    static class SimpleOrders {

        private Long id;

        private String name;

        // constructors, getters/setters

    }

}
