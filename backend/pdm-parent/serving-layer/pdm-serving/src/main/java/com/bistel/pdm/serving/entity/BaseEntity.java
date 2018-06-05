package com.bistel.pdm.serving.entity;

//@MappedSuperclass
public abstract class BaseEntity implements Identifiable {

    //@Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
